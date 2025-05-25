using Microsoft.AspNetCore.Identity;

namespace FinancialManagementWepApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public decimal Balance { get; set; } = 0;

    }
}
