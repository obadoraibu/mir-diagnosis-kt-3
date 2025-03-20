package service

import (
	"github.com/obadoraibu/go-auth/internal/domain"
	"time"
)

type Service struct {
	repo         Repository
	tokenManager TokenManager
	emailSender  EmailSender
}

type Repository interface {
	CreateUserAndEmailConfirmation(u *domain.User, confirmationCode string, expiresAt time.Time) (*domain.User, error)
	FindUserByEmail(email string) (*domain.User, error)
	ConfirmEmail(code string) error
	AddToken(fingerprint, refresh, email string) error
	DeleteToken(u *domain.User) error
	FindAndDeleteRefreshToken(refresh, fingerprint string) (string, error)
	Close() error
}

type TokenManager interface {
	GenerateJWT(email string) (string, error)
	GenerateRefresh() string
}

type EmailSender interface {
	SendConfirmationEmail(to, code string) error
}

type Dependencies struct {
	Repo         Repository
	TokenManager TokenManager
	EmailService EmailSender
}

func NewService(deps Dependencies) *Service {
	return &Service{
		repo:         deps.Repo,
		tokenManager: deps.TokenManager,
		emailSender:  deps.EmailService,
	}
}
