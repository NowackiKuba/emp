package routes

import "github.com/gin-gonic/gin"


func RegisterRoutes(server *gin.Engine) { 
	server.POST("/signup", signup)
	server.POST("/login", login)
	server.POST("/create-company", createCompany)
	server.POST("/create-employee", createEmployeeAccount)
	server.POST("/pto", createPto)
	server.POST("/task", createTask)
	server.POST("/poll", createPoll)
	server.POST("/answer", answerPoll)
	server.POST("/survey", createSurvey)
	server.POST("/answer-survey", AnswerSurvey)

	server.PATCH("/pto/:ptoId", updatePTO)
	server.PATCH("/employee/:userId", updateEmployee)
	server.PATCH("/task/:taskId", updateTask)
	server.PATCH("/start-work/:userId", startWork)
	server.PATCH("/end-work/:userId", endWork)
	server.PATCH("/manage-break/:id", manageBreak)
	server.PATCH("/read/notifications/:notificationId", readNotification)

	server.GET("/employees/:companyId", getCompanyUsers)
	server.GET("/pto/:companyId", getCompanyPtos)
	server.GET("/tasks/:companyId", getCompanyTasks)
	server.GET("/employee/work-history/:userId", getUserWorkHistory)
	server.GET("/user/:id", getUserById)
	server.GET("/user/surveys/:userId", getUserById)
	server.GET("/user/answered-polls/:userId", getUserAnsweredPolls)
	server.GET("/user/answered-surveys/:userId", getUserAnsweredSurveys)
	server.GET("/task/:id", getTaskById)
	server.GET("/tasks/employee/:userId", getEmployeeTasks)
	server.GET("/surveys/:companyId", getCompanySurveys)
	server.GET("/questions/:surveyId", GetSurveyQuestions)
	server.GET("/polls/:companyId", getCompanyPolls)
	server.GET("/answers/:pollId", getPollAnswers)
	server.GET("/survey/answers/:surveyId", getSurveyAnswers)
	server.GET("/notifications/:userId", getUserNotifications)

	server.DELETE("/task/:id")
	server.DELETE("/employee/:id", deleteEmployee)
	server.DELETE("/notification/:id", deleteEmployee)
}