show databases;

DESC users;

DESC jobs;

ALTER TABLE users MODIFY password_hash VARCHAR(60);

SELECT * FROM users;

SELECT * FROM jobs;

DELETE FROM users WHERE idusers = 4;

COMMIT;


CREATE TABLE `jobby`.`jobs` (
  `idjobs` INT NOT NULL AUTO_INCREMENT,
  `idusers` INT NOT NULL,
  `job_title` VARCHAR(45) NOT NULL,
  `job_company` VARCHAR(45) NOT NULL,
  `job_location` VARCHAR(45) NOT NULL,
  `job_status` ENUM('Applied', 'Interviewing', 'Offered', 'Rejected') NOT NULL DEFAULT 'Applied',
  PRIMARY KEY (`idjobs`),
  INDEX `idusers_idx` (`idusers` ASC),
  CONSTRAINT `fk_jobs_users`
    FOREIGN KEY (`idusers`)
    REFERENCES `jobby`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

