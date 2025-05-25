using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialManagementWepApi.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(100)]
        public string Category { get; set; }

        [MaxLength(250)]
        public string? Description { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

 
        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}
