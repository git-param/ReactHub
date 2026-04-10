from fastapi import HTTPException, status


class AppException(Exception):
    """Base application exception."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class UserAlreadyExistsException(AppException):
    """User with email already exists."""
    def __init__(self, email: str):
        super().__init__(
            f"User with email {email} already exists",
            status.HTTP_400_BAD_REQUEST
        )


class InvalidCredentialsException(AppException):
    """Invalid email or password."""
    def __init__(self):
        super().__init__(
            "Invalid email or password",
            status.HTTP_401_UNAUTHORIZED
        )


class UserNotFoundexception(AppException):
    """User not found."""
    def __init__(self, user_id: int = None):
        msg = "User not found"
        if user_id:
            msg = f"User with id {user_id} not found"
        super().__init__(msg, status.HTTP_404_NOT_FOUND)


class ComponentNotFoundexception(AppException):
    """Component not found."""
    def __init__(self, component_id: str):
        super().__init__(
            f"Component with id {component_id} not found",
            status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(AppException):
    """User not authorized for this action."""
    def __init__(self, message: str = "Not authorized"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)
