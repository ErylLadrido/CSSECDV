-- script to write default admin user
INSERT INTO jobby.users(first_name, last_name, email, phone_number, profile_photo, password_hash, salt, role)
	VALUES(
		"Miguel", 
        "Gonzales", 
        "miguel_gonzales@dlsu.edu.ph", 
        "09177426423", 
        "", 
        "$2a$12$.YiTOeldV6Nkp52ZMZIm0.LXeSJcJtJSO3p0vD20Q99RRlr//Wka.", 
        "11000010011010001101101010001000101101111000000101101001111100100001010100100001", 
        "admin");
        
SELECT * FROM jobby.users;