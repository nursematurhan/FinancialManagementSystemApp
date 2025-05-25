using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialManagementWepApi.Models
{
    public class Transfer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [MaxLength(250)]
        public string? Description { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public string? SenderId { get; set; }

        [ForeignKey("SenderId")]
        public ApplicationUser? Sender { get; set; }


        [Required]
        public string RecipientId { get; set; }

        [ForeignKey("RecipientId")]
        public ApplicationUser? Recipient { get; set; }
    }
}
