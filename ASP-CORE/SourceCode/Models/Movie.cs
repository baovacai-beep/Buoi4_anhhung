using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using _31241023360_HoGiaBao.Validation;

namespace _31241023360_HoGiaBao.Models;

public class Movie
{
    public int ID { get; set; }

    [Display(Name = "Tiêu đề")]
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; }

    [Display(Name = "Tóm tắt")]
    [StringLength(int.MaxValue, MinimumLength = 3)]
    public string Summary { get; set; }

    [Display(Name = "Ngày phát hành")]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
    [CheckDateGreaterThanTodayAttribute]
    public DateTime ReleaseDate { get; set; }

    [StringLength(10)]
    [Display(Name = "Thể loại")]
    [GenreAttribute]
    public string Genre { get; set; }

    [ForeignKey("GenreObj")]
    public int? GenreID { get; set; }

    public virtual Genre GenreObj { get; set; }

    [Display(Name = "Giá")]
    [Range(5000, double.MaxValue)]
    [DisplayFormat(DataFormatString = "{0:0,000}")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Display(Name = "Xếp hạng")]
    [Range(1, 5)]
    public double Rated { get; set; }

    public string PicturePath { get; set; }

    [NotMapped]
    [Display(Name = "Hình ảnh")]
    public IFormFile PictureUpload { get; set; }
}
