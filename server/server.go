package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/gif"  // Register GIF decoder
	_ "image/jpeg" // Register JPEG decoder
	_ "image/png"  // Register PNG decoder
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	_ "golang.org/x/image/webp" // Add WebP support
	_ "github.com/go-sql-driver/mysql"
)

// Global validator instance
var validate *validator.Validate

// SignupData struct for the signup request
type SignupData struct {
	LastName      string                `form:"lastName" binding:"required"`
	FirstName     string                `form:"firstName" binding:"required"`
	Email         string                `form:"email" binding:"required,email"`
	Password      string                `form:"password" binding:"required,min=8"`
	PhoneNumber   string                `form:"phoneNumber" binding:"required,phone"`
	ProfilePhoto  *multipart.FileHeader `form:"profilePhoto"`
	Role          string                `form:"role"` // New field: role
}

// LoginData struct for the login request
type LoginData struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

var validPhoneNumber validator.Func = func(fl validator.FieldLevel) bool {
	phoneRegex := `^(09|\+639)\d{9}$`
	re := regexp.MustCompile(phoneRegex)
	return re.MatchString(fl.Field().String())
}

// Custom error handler for validation errors
func customValidationErrors(err error) gin.H {
	var customErrors = make(map[string]string)
	for _, e := range err.(validator.ValidationErrors) {
		switch e.Tag() {
		case "required":
			customErrors[e.Field()] = e.Field() + " is required."
		case "email":
			customErrors[e.Field()] = e.Field() + " must be a valid email address."
		case "min":
			customErrors[e.Field()] = e.Field() + " must have a minimum length of 8."
		case "phone":
			customErrors[e.Field()] = "Invalid phone number format. Phone number must start with +639 or 09."
		default:
			customErrors[e.Field()] = "Invalid " + e.Field()
		}
	}
	return gin.H{
		"error": customErrors,
	}
}

// Generate a random salt of maximum 45 characters
func generateSalt() (string, error) {
	saltBytes := make([]byte, 45)
	_, err := rand.Read(saltBytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate salt: %v", err)
	}
	return base64.URLEncoding.EncodeToString(saltBytes)[:45], nil
}

// Hash the password with the salt using bcrypt
func hashPassword(password, salt string) (string, error) {
	// Combine salt and password
	saltedPassword := salt + password

	// Hash the salted password using bcrypt
	hash, err := bcrypt.GenerateFromPassword([]byte(saltedPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %v", err)
	}
	return string(hash), nil
}

func validateProfilePhoto(file *multipart.FileHeader) error {
	const maxFileSize = 5 * 1024 * 1024 // 5MB
	if file.Size > maxFileSize {
		return fmt.Errorf("profile photo is too large. Maximum size is 5MB")
	}

	f, err := file.Open()
	if err != nil {
		return fmt.Errorf("could not open file: %v", err)
	}
	defer f.Close()

	_, format, err := image.Decode(f)
	if err != nil {
		return fmt.Errorf("invalid image format: %v", err)
	}

	// Adjust based on supported decoders
	validFormats := []string{"jpeg", "png", "gif", "bmp"}
	if !contains(validFormats, format) {
		return fmt.Errorf("unsupported image format: %s", format)
	}

	return nil
}

func contains(arr []string, item string) bool {
	for _, a := range arr {
		if a == item {
			return true
		}
	}
	return false
}

// Database connection
var db *sql.DB

func initDB() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get database credentials from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Create the connection string
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)
	log.Println("Connection string:", connectionString) // Log the connection string

	// Connect to the database
	db, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Connected to MySQL database")
}

func signUpHandler(c *gin.Context) {
	var signupData SignupData

	if err := c.ShouldBind(&signupData); err != nil {
		c.JSON(http.StatusBadRequest, customValidationErrors(err))
		return
	}

	// Initialize role to "user" if not provided
	if signupData.Role == "" {
		signupData.Role = "user"
	}

	// Validate the role
	if signupData.Role != "user" && signupData.Role != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role. Role must be either 'user' or 'admin'."})
		return
	}

	// Generate a random salt
	salt, err := generateSalt()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate salt"})
		return
	}

	// Hash the password with the salt
	hashedPassword, err := hashPassword(signupData.Password, salt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Handle profile photo upload
	var profilePhotoPath string
	if signupData.ProfilePhoto != nil {
		// Validate the image first
		if err := validateProfilePhoto(signupData.ProfilePhoto); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save the file
		fileExt := filepath.Ext(signupData.ProfilePhoto.Filename)
		newFilename := fmt.Sprintf("%d%s", time.Now().UnixNano(), fileExt)
		filePath := filepath.Join("uploads", newFilename)

		if err := c.SaveUploadedFile(signupData.ProfilePhoto, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save profile photo",
			})
			return
		}

		profilePhotoPath = filePath
		log.Printf("Saved profile photo to: %s", profilePhotoPath)
	}

	// Insert user into the database
	query := `
		INSERT INTO users (first_name, last_name, email, phone_number, profile_photo, password_hash, salt, role)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	log.Println("Executing query:", query)
	log.Println("Parameters:", signupData.FirstName, signupData.LastName, signupData.Email, signupData.PhoneNumber, profilePhotoPath, hashedPassword, salt, signupData.Role)

	_, err = db.Exec(query,
		signupData.FirstName,
		signupData.LastName,
		signupData.Email,
		signupData.PhoneNumber,
		profilePhotoPath,
		hashedPassword,
		salt,
		signupData.Role,
	)
	if err != nil {
		log.Println("Error executing query:", err) // Log the error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user to database"})
		return
	}

	// Respond with success message
	c.JSON(http.StatusOK, gin.H{
		"message":       "Signup successful",
		"role":          signupData.Role,
		"profile_photo": profilePhotoPath,
	})
}

// func loginHandler(c *gin.Context) {
// 	var loginData LoginData

// 	// Bind the login request data
// 	if err := c.ShouldBind(&loginData); err != nil {
// 		c.JSON(http.StatusBadRequest, customValidationErrors(err))
// 		return
// 	}

// 	// Fetch the user's salt and password hash from the database
// 	var (
// 		passwordHash string
// 		salt         string
// 	)
// 	query := `SELECT password_hash, salt FROM users WHERE email = ?`
// 	err := db.QueryRow(query, loginData.Email).Scan(&passwordHash, &salt)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
// 		} else {
// 			log.Println("Error fetching user from database:", err)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
// 		}
// 		return
// 	}

// 	// Hash the inputted password with the retrieved salt
// 	hashedPassword, err := hashPassword(loginData.Password, salt)
// 	if err != nil {
// 		log.Println("Error hashing password:", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
// 		return
// 	}

// 	// Compare the hashed password with the stored password hash
// 	if hashedPassword != passwordHash {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
// 		return
// 	}

// 	// Login successful
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Login successful",
// 	})
// }
func loginHandler(c *gin.Context) {
	var loginData LoginData

	// Bind the login request data
	if err := c.ShouldBind(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, customValidationErrors(err))
		return
	}

	// Fetch the user's salt and password hash from the database
	var (
		passwordHash string
		salt         string
	)
	
	query := `SELECT password_hash, salt FROM users WHERE email = ?`
	err := db.QueryRow(query, loginData.Email).Scan(&passwordHash, &salt)
	if err != nil {
		if err == sql.ErrNoRows {
			// No user found with the provided email
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		} else {
			// Database error
			log.Println("Error fetching user from database:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
		}
		return
	}

	// Concatenate the salt with the provided password
	passwordWithSalt := salt + loginData.Password

	// Hash the concatenated string (salt + password)
	hashedPassword, err := hashPassword(passwordWithSalt, salt)
	if err != nil {
		log.Println("Error hashing password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Compare the newly hashed password with the stored password hash
	if hashedPassword != passwordHash {
		// Passwords don't match
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Login successful
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
	})
}


func main() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	// Initialize MySQL database
	initDB()
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Initialize the global validator
	validate = validator.New()

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("phone", validPhoneNumber)
	}

	// Enable CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Specify frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Define signup route
	r.POST("/signup", signUpHandler)

	// Define login route
	r.POST("/login", loginHandler)

	r.Static("/uploads", "./uploads")

	// Run the server
	r.Run(":8080")
}