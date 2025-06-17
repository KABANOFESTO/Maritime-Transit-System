package rw.maritime.nvg.exception;

import java.util.List;

public class ValidationException extends RuntimeException {
    private List<org.springframework.validation.FieldError> fieldErrors;
    
    public ValidationException(List<org.springframework.validation.FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
    
    // getter
    public List<org.springframework.validation.FieldError> getFieldErrors() {
        return fieldErrors;
    }
    public ValidationException(String message) {
        super(message);
    }
}


