using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _31241023360_HoGiaBao.Models;

public class HoaDon
{
    public HoaDon()
    {
        ChiTietHoaDons = new List<ChiTietHoaDon>();
    }

    [Key]
    public int MaHoaDon { get; set; }

    public IList<ChiTietHoaDon> ChiTietHoaDons { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TongTien { get; set; }

    public DateTime NgayLap { get; set; }

    public int? MaKhachHang { get; set; }
}
