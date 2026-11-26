using System.ComponentModel.DataAnnotations;

namespace _31241023360_HoGiaBao.Validation;

public class CheckDateGreaterThanTodayAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime dt && dt >= DateTime.UtcNow)
        {
            return ValidationResult.Success;
        }
        return new ValidationResult(ErrorMessage ?? "Dữ liệu ngày phải lớn hơn ngày hôm nay");
    }
}
