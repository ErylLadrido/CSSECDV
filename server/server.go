package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"time"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	_ "golang.org/x/image/webp" // Add WebP support
	"github.com/golang-jwt/jwt/v5"
)

// Global validator instance
var validate *validator.Validate

// SignupData struct for the signup request
type SignupData struct {
	LastName     string                `form:"lastName" binding:"required"`
	FirstName    string                `form:"firstName" binding:"required"`
	Email        string                `form:"email" binding:"required,email"`
	Password     string                `form:"password" binding:"required,min=8"`
	PhoneNumber  string                `form:"phoneNumber" binding:"required,phone"`
	ProfilePhoto *multipart.FileHeader `form:"profilePhoto"`
	Role         string                `form:"role"` // New field: role
}

// LoginData struct for the login request
type LoginData struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

// JobData struct for the job request
type JobData struct {
	IDJobs	  	int    `json:"idjobs"`
	JobTitle    string `form:"jobTitle" binding:"required"`
	JobCompany  string `form:"jobCompany" binding:"required"`
	JobLocation string `form:"jobLocation" binding:"required"`
	JobStatus   string `form:"jobStatus" binding:"required"`
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
var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY")) // Ensure you have a JWT secret key in your environment variables

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

	// Check for a specific email and assign "admin" role if matched
	if signupData.Email == "admin@admin.com" { // Replace with the desired email
		signupData.Role = "admin"
	} else if signupData.Role == "" {
		signupData.Role = "user"
	}

	// Log to confirm role is set
	log.Printf("Role assigned: %s", signupData.Role)

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

	log.Printf("Role assigned during signup: %s", signupData.Role)
}

// func loginHandler(c *gin.Context) {
// 	var loginData LoginData

// 	// Bind the login request data
// 	if err := c.ShouldBind(&loginData); err != nil {
// 		c.JSON(http.StatusBadRequest, customValidationErrors(err))
// 		return
// 	}

// 	// Fetch the user's password hash and salt from the database
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

// 	// Combine the stored salt with the input password
// 	saltedPassword := salt + loginData.Password

// 	// Compare the salted password with the stored hash using bcrypt
// 	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(saltedPassword))
// 	if err != nil {
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

    // Fetch the user's password hash and salt from the database
    var (
		userID       int
        passwordHash string
        salt         string
        role         string
    )
    query := `SELECT idusers, password_hash, salt, role FROM users WHERE email = ?`
    err := db.QueryRow(query, loginData.Email).Scan(&userID, &passwordHash, &salt, &role)

	log.Printf("Fetched role for %s: %s", loginData.Email, role)
    if err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        } else {
            log.Println("Error fetching user from database:", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
        }
        return
    }

    // Combine the stored salt with the input password
    saltedPassword := salt + loginData.Password

    // Compare the salted password with the stored hash using bcrypt
    err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(saltedPassword))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        return
    }

	loginData.Email = strings.TrimSpace(loginData.Email)
	loginData.Email = strings.ToLower(loginData.Email)
	log.Printf("Logging in with email: %s", loginData.Email)
	log.Printf("Fetched role for %s: %s", loginData.Email, role)

	// Check if the email is admin@admin.com and set the role to "admin"
    if loginData.Email == "admin@admin.com" {
        role = "admin"
    }
	
    // Generate a JWT token upon successful login
    claims := jwt.MapClaims{
		"idusers": userID, // Store user ID for access control
        "email": loginData.Email,
        "role":  role, // Store role for access control
        "exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expiration time (24 hours)
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create JWT token"})
        return
    }

    // Respond with the JWT token
    c.JSON(http.StatusOK, gin.H{
        "message": "Login successful",
        "token":   tokenString, // Send the token to the frontend
		"role": role,
    })

	log.Printf("Role retrieved during login: %s", role)
}

func authMiddleware(c *gin.Context) {
	// Get the token from the Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		c.Abort()
		return
	}

	// Token is usually prefixed with "Bearer ", so we need to extract the actual token
	tokenString := authHeader[len("Bearer "):]

	// Parse and validate JWT token
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		c.Abort()
		return
	}

	// Attach user info to context for use in protected routes
	c.Set("user", claims)
	c.Next()
}

/*********************** JOBS FUNCTION ***********************/
func addJobHandler(c *gin.Context) {
	var jobData JobData

	if err := c.ShouldBind(&jobData); err != nil {
		c.JSON(http.StatusBadRequest, customValidationErrors(err))
		return
	}

	// Get user ID from context (set by authMiddleware)
    userClaims, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in token"})
        return
    }

	claims, ok := userClaims.(jwt.MapClaims)
    if !ok {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
        return
    }

	userIDFloat, ok := claims["idusers"].(float64) // JWT stores numbers as float64
    if !ok {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
        return
    }
    userID := int(userIDFloat) // Convert to int

	// Insert job into the database (now including user ID)
    query := `
        INSERT INTO jobs (idusers, job_title, job_company, job_location, job_status)
        VALUES (?, ?, ?, ?, ?)
    `

	log.Println("Executing query:", query)
    log.Println("Parameters:", userID, jobData.JobTitle, jobData.JobCompany, jobData.JobLocation, jobData.JobStatus)

	res, err := db.Exec(query,
        userID,                  // Include user ID
        jobData.JobTitle,
        jobData.JobCompany,
        jobData.JobLocation,
        jobData.JobStatus,
    )
    if err != nil {
        log.Println("Error executing query:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save job to database"})
        return
    }

	// Get the last inserted job ID
	lastInsertID, err := res.LastInsertId()
	if err != nil {
		log.Println("Error fetching last inserted ID:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save job to database"})
		return
	}

	// Respond with success message
    c.JSON(http.StatusOK, gin.H{
        "message": "Job created successfully",
		"job": gin.H{
			"idjobs": lastInsertID,
			"job_title": jobData.JobTitle,
			"job_company": jobData.JobCompany,
			"job_location": jobData.JobLocation,
			"job_status": jobData.JobStatus,
		},
    })
}

func getJobsHandler(c *gin.Context) {
	// Get user ID from context (set by authMiddleware)
	userClaims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in token"})
		return
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return
	}

	userIDFloat, ok := claims["idusers"].(float64) // JWT stores numbers as float64
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
		return
	}

	userID := int(userIDFloat) // Convert to int


    // Fetch all jobs from the database
    query := `SELECT idjobs, job_title, job_company, job_location, job_status FROM jobs WHERE idusers = ?`
    rows, err := db.Query(query, userID)
    if err != nil {
        log.Println("Error fetching jobs from database:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
        return
    }
    defer rows.Close() // Ensure rows are closed after function exits

    var jobs []JobData

    // Iterate over the rows to fetch all jobs
    for rows.Next() {
        var job JobData
        err := rows.Scan(&job.IDJobs, &job.JobTitle, &job.JobCompany, &job.JobLocation, &job.JobStatus)
        if err != nil {
            log.Println("Error scanning job row:", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
            return
        }
        jobs = append(jobs, job)
    }

    // Check for iteration errors
    if err := rows.Err(); err != nil {
        log.Println("Error iterating job rows:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
        return
    }

    // Always return a JSON with an empty "jobs" array if no jobs exist
    c.JSON(http.StatusOK, gin.H{"jobs": jobs})
}




/*********************** MAIN FUNCTION ***********************/
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

	r.GET("/admin", authMiddleware, func(c *gin.Context) {
		// Check if the user has an "admin" role
		user, _ := c.Get("user")
		claims := user.(jwt.MapClaims)
		if claims["role"] != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			return
		}
	
		// Proceed to the admin panel
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to the Admin Panel!"})
	})
	
	// Other protected routes
	r.GET("/userprofile", authMiddleware, func(c *gin.Context) {
		// User profile logic here
		c.JSON(http.StatusOK, gin.H{"message": "User Profile"})
	})
	
	r.Static("/uploads", "./uploads")

	/*********************** JOBS ROUTES ***********************/
	// r.POST("/userpanel", createJobHandler)
	// r.GET("/userpanel", getJobsHandler)
	authorized := r.Group("/userpanel", authMiddleware)
	{
		authorized.POST("", addJobHandler)
		authorized.GET("", getJobsHandler)
	}


	// Run the server
	r.Run(":8080")
}
