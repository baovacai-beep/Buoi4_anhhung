using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using _31241023360_HoGiaBao.Models;

namespace _31241023360_HoGiaBao.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<ChiTietHoaDon> ChiTietHoaDons { get; set; }
    public DbSet<HoaDon> HoaDons { get; set; }
    public DbSet<ShippingDetail> ShippingDetails { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
}
