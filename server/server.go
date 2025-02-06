package main

import (
	"fmt"
	"image"
	"log"
	"mime/multipart"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

// Global validator instance
var validate *validator.Validate

// SignupData struct for the signup request
type SignupData struct {
    LastName    string               `form:"lastName" binding:"required"`
    FirstName   string               `form:"firstName" binding:"required"`
    Email       string               `form:"email" binding:"required,email"`
    Password    string               `form:"password" binding:"required,min=8"`
    PhoneNumber string               `form:"phoneNumber" binding:"required,phone"`
    ProfilePhoto *multipart.FileHeader `form:"profilePhoto"`
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

func validateProfilePhoto(file *multipart.FileHeader) error {
    // Check file size (example: limit to 5MB)
    const maxFileSize = 32 * 1024 * 1024 // Max file size is 32MB
    if file.Size > maxFileSize {
        return fmt.Errorf("profile photo is too large. Maximum size is 32MB")
    }

    // Check MIME type (only allow image files)
    mimeType := file.Header.Get("Content-Type")
    if !strings.HasPrefix(mimeType, "image/") {
        return fmt.Errorf("invalid file type. Only image files are allowed")
    }

    // Open the file to check if it's an actual image
    f, err := file.Open()
    if err != nil {
        return fmt.Errorf("could not open file: %v", err)
    }
    defer f.Close()

    // Try to decode the image
    _, _, err = image.Decode(f)
    if err != nil {
        return fmt.Errorf("the uploaded file is not a valid image")
    }

    return nil
}

func signUpHandler(c *gin.Context) {
    var signupData SignupData

    // Bind incoming request data
    if err := c.ShouldBind(&signupData); err != nil {
        log.Println("Binding failed:", err)
        c.JSON(http.StatusBadRequest, customValidationErrors(err))
        return
    }

    // Validate the profile photo if present
    if signupData.ProfilePhoto != nil {
        if err := validateProfilePhoto(signupData.ProfilePhoto); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": err.Error(),
            })
            return
        }
    }

    // Manually validate after binding
    if err := validate.Struct(&signupData); err != nil {
        log.Println("Validation failed:", err)
        c.JSON(http.StatusBadRequest, customValidationErrors(err))
        return
    }

    // Everything is valid, proceed with signup logic
    log.Println("Received signup data:", signupData)
    c.JSON(http.StatusOK, gin.H{
        "message": "Signup successful",
    })
}

func main() {
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

    // Run the server
    r.Run(":8080")
}
