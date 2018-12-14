package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

type Questions struct {
	gorm.Model
	Question string `json:"question"`
	Type     string `json:"type"`
	OptionA  string `json:"optionA"`
	OptionB  string `json:"optionB"`
	OptionC  string `json:"optionC"`
	OptionD  string `json:"optionD"`
	CorrectA bool   `json:"correcta"`
	CorrectB bool   `json:"correctb"`
	CorrectC bool   `json:"correctc"`
	CorrectD bool   `json:"correctd"`
	QuizName string `json:"quiz"`
}
type Quizzes struct {
	Name               string      `json:"name" gorm:"primary_key"`
	Genre              string      `json:"genre"`
	Questions          []Questions `json:"questions" gorm:"foreignkey:QuizName"`
	MarksForCorrect    string      `json:"mfc"`
	MarksForIncorrect  string      `json:"mfi"`
	MarksForUnanswered string      `json:"mfu"`
	ScoreForQuiz       []Score     `json:"scoreidsforquiz" gorm:"foreignkey:Quiz"`
}
type User struct {
	Username     string  `json:"username" gorm:"primary_key"`
	Password     string  `json:"password"`
	Total        int     `json:"total"`
	Lifelines    int     `json:"lifelines"`
	ScoreForUser []Score `json:"scoreidsforuser" gorm:"foreignkey:User"`
}

type Score struct {
	gorm.Model
	User       string `json:"user"`
	Quiz       string `json:"quizPlayed"`
	Correct    int    `json:"correct"`
	Incorrect  int    `json:"incorrect"`
	Unanswered int    `json:"unanswered"`
	Points     int    `json:"points"`
}

func main() {
	db, err = gorm.Open("sqlite3", "./quizDataBase.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Questions{})
	db.AutoMigrate(&Quizzes{})
	db.AutoMigrate(&Score{})

	router := gin.Default()
	router.GET("/users/:username", getUser)
	router.POST("/register", doReg)
	router.POST("/login", doLogin)
	router.POST("/createQuiz", doCreateQuiz)
	router.GET("/quizzes/:name", getQuiz)
	router.POST("/createQuestion", doCreateQuestion)
	router.GET("/getQuestions/:name", getQuestions)
	router.GET("/indexer/:genre", genreBasedIndexer)
	router.GET("/scores/:username", showScores)
	router.POST("/createScore", doCreateScore)
	router.GET("/leaderboard", showLeaderboard)
	router.GET("/indexUsers", showUsers)
	router.GET("/delUser/:username", delUser)
	router.GET("/delQuestion/:id", delQuestion)
	router.GET("getOneQuestion/:id", getOneQuestion)
	router.GET("/reduceLifeline/:username", redLifeline)
	router.GET("/getLifelines/:username", getLifeline)
	router.Use((cors.Default()))
	router.Run(":8080")
}

func getLifeline(c *gin.Context) {
	c.Header("access-control-allow-origin", "*")
	name := c.Params.ByName("username")
	var user User
	db.Select("lifelines").Where("username=?", name).First(&user)
	c.JSON(200, user)

}

func redLifeline(c *gin.Context) {
	name := c.Params.ByName("username")
	var user User
	c.Header("access-control-allow-origin", "*")
	db.Where("username=?", name).First(&user)
	user.Lifelines = user.Lifelines - 1
	db.Save(&user)
	c.JSON(200, user)
}

func getOneQuestion(c *gin.Context) {
	c.Header("access-control-allow-origin", "*")
	id := c.Params.ByName("id")
	var question Questions
	db.Where("id=?", id).First(&question)
	c.JSON(200, question)
}

func delQuestion(c *gin.Context) {
	var question Questions
	id := c.Params.ByName("id")
	c.Header("access-control-allow-origin", "*")
	db.Table("questions").Where("id=?", id).Delete(&question)
}

func delUser(c *gin.Context) {
	var user User
	username := c.Params.ByName("username")
	c.Header("access-control-allow-origin", "*")
	if err := db.Where("username=?", username).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
	} else {
		db.Model(&user).Association("ScoreForUser").Delete(user.ScoreForUser)
		db.Where("username=?", username).Delete(User{})
	}
}

func showUsers(c *gin.Context) {
	var users []User
	c.Header("access-control-allow-origin", "*")
	db.Order("username").Select("username").Find(&users)
	fmt.Println(users)
	c.JSON(200, users)
}

func showScores(c *gin.Context) {
	var scores []Score
	var user User
	c.Header("access-control-allow-origin", "*")
	name := c.Params.ByName("username")
	if err := db.Where("username=?", name).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
	} else {
		db.Model(&user).Order("points desc").Related(&scores, "ScoreForUser")
		c.JSON(200, scores)
	}

}

func showLeaderboard(c *gin.Context) {
	var users []User
	c.Header("access-control-allow-origin", "*")
	db.Table("users").Order("total desc").Select("username,total").Find(&users)
	c.JSON(200, users)
}

func doLogin(c *gin.Context) {
	var user, query User
	c.BindJSON(&user)
	c.Header("access-control-allow-origin", "*")
	if user.Username == "" {
		c.AbortWithStatus(404)
	} else {
		if err := db.Where("username=?", user.Username).First(&query).Error; err != nil {
			c.AbortWithStatus(404)
		} else {
			if query.Password == user.Password {
				c.JSON(200, &user)
			} else {
				c.AbortWithStatus(404)
			}
		}
	}
}

func doCreateScore(c *gin.Context) {
	var score Score
	var user User
	c.BindJSON(&score)
	c.Header("access-control-allow-origin", "*")
	fmt.Println(score)
	err := db.Where("username=?", score.User).First(&user).Error
	if err == nil {
		user.Total += score.Points
		if float64(score.Correct) > 0.8*(float64(score.Correct+score.Incorrect+score.Unanswered)) {
			user.Lifelines = user.Lifelines + 1
		}
		db.Save(&user)
	}
	db.Create(&score)
	c.JSON(200, score)
}

func getQuestions(c *gin.Context) {
	var questions []Questions
	var quiz Quizzes
	name := c.Params.ByName("name")
	c.Header("access-control-allow-origin", "*")
	if err := db.Where("name=?", name).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
	} else {
		db.Model(&quiz).Related(&questions, "Questions")
		c.JSON(200, questions)
	}
}

func genreBasedIndexer(c *gin.Context) {
	var quizzes []Quizzes
	genre := c.Params.ByName("genre")
	c.Header("access-control-allow-origin", "*")
	if genre == "All" {
		if err := db.Find(&quizzes).Error; err != nil {
			fmt.Println(err)
			c.AbortWithStatus(404)
		} else {
			fmt.Println(quizzes)
			c.JSON(200, quizzes)
		}
	} else {
		if err := db.Where("genre=?", genre).Find(&quizzes).Error; err != nil {
			fmt.Println(err)
			c.AbortWithStatus(404)
		} else {
			fmt.Println(quizzes)
			c.JSON(200, quizzes)
		}
	}
}

func doCreateQuestion(c *gin.Context) {
	var question Questions
	var quiz Quizzes
	c.BindJSON(&question)
	count := 0
	if question.CorrectA == false {
		count++
	}
	if question.CorrectB == false {
		count++
	}
	if question.CorrectC == false {
		count++
	}
	if question.CorrectD == false {
		count++
	}
	c.Header("access-control-allow-origin", "*")
	if question.Question == "" || count == 4 {
		c.AbortWithStatus(404)
	} else {
		db.Where("name=?", question.QuizName).First(&quiz)
		db.Create(&question)
		fmt.Println(question)
		c.JSON(200, question)
	}
}

func doCreateQuiz(c *gin.Context) {
	var quiz Quizzes
	c.BindJSON(&quiz)
	c.Header("access-control-allow-origin", "*")
	if quiz.Name == "" || quiz.Genre == "" {
		c.AbortWithStatus(404)
	} else {
		fmt.Println(quiz)
		db.Create(&quiz)
		c.JSON(200, quiz)
	}
}

func getQuiz(c *gin.Context) {
	name := c.Params.ByName("name")
	var quiz Quizzes
	fmt.Println(name)
	c.Header("access-control-allow-origin", "*")
	if err := db.Where("name = ?", name).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
	} else {
		c.JSON(200, quiz)
	}
}

func getUser(c *gin.Context) {
	username := c.Params.ByName("username")
	var user User
	c.Header("access-control-allow-origin", "*")
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
	} else {
		c.JSON(200, user)
	}
}

func doReg(c *gin.Context) {
	var user User
	c.BindJSON(&user)
	c.Header("access-control-allow-origin", "*")
	if user.Username == "" || user.Password == "" {
		c.AbortWithStatus(404)
	} else {
		db.Create(&user)
		c.JSON(200, user)
	}
}
