package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"log"
	"mime/multipart"
	"github.com/gin-contrib/cors"
	"regexp"
	"github.com/go-playground/validator/v10"
)

type SignupData struct {
	LastName    string               `form:"lastName" binding:"required"`
	FirstName   string               `form:"firstName" binding:"required"`
	Email       string               `form:"email" binding:"required,email"`
	Password    string               `form:"password" binding:"required,min=6"`
	PhoneNumber string               `form:"phoneNumber" binding:"required"`
	ProfilePhoto *multipart.FileHeader `form:"profilePhoto"`
}

// Custom validation for phone number (example of regex validation)
func validatePhoneNumber(fl validator.FieldLevel) bool {
	phoneRegex := `^(09|\+639)\d{9}$` // Basic phone number regex (adjust as needed)
	re := regexp.MustCompile(phoneRegex)
	return re.MatchString(fl.Field().String())
}

func signUpHandler(c *gin.Context) {
	var signupData SignupData

	// Bind incoming data
	if err := c.ShouldBind(&signupData); err != nil {
		// If binding fails, return an error
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Create a new validator instance
	validate := validator.New()

	// Register custom validation for the 'phone' field
	validate.RegisterValidation("phone", validatePhoneNumber)

	// Validate phone number manually
	if err := validate.Var(signupData.PhoneNumber, "phone"); err != nil {
		// Custom phone number validation failed
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid phone number format",
		})
		return
	}

	// Manually validate the entire struct
	if err := validate.Struct(&signupData); err != nil {
		// Validation failed for other fields
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// If everything is valid, proceed
	log.Println("Received signup data:", signupData)

	c.JSON(http.StatusOK, gin.H{
		"message": "Signup successful",
	})
}

func main() {
	r := gin.Default()

	// Enable CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Specify your frontend's origin here
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Route for signup
	r.POST("/signup", signUpHandler)

	r.Run(":8080")
}
