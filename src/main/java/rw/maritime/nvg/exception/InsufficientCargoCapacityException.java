package rw.maritime.nvg.exception;

public class InsufficientCargoCapacityException extends Exception {
    
    public InsufficientCargoCapacityException(String message) {
        super(message);
    }
    
    public InsufficientCargoCapacityException(String message, Throwable cause) {
        super(message, cause);
    }
}