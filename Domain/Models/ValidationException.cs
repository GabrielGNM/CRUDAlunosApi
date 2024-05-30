namespace Domain.Models
{
    public class ValidationException(string message) : Exception(message)
    {
    }
}
