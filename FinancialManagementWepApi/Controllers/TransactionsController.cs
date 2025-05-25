using FinancialManagementWepApi.Data;
using FinancialManagementWepApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FinancialManagementWepApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetMyTransactions()
        {
            var userId = User.FindFirstValue("uid");
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.User)
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();
            return transaction;
        }


        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Transaction>> CreateTransaction(Transaction transaction)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
            if (userId == null)
                return Unauthorized();

            transaction.UserId = userId; 

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, Transaction updated)
        {
            if (id != updated.Id) return BadRequest();

            var userId = User.FindFirstValue("uid");


            var existing = await _context.Transactions.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (existing == null) return Unauthorized();

            updated.UserId = userId; 
            _context.Entry(updated).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var userId = User.FindFirstValue("uid");

            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (transaction == null) return Unauthorized();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
