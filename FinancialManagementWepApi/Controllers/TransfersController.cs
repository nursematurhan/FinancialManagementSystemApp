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
    public class TransfersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransfersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<Transfer>>> GetMyTransfers()
        {
            var userId = User.FindFirstValue("uid");
            var transfers = await _context.Transfers
                .Where(t => t.SenderId == userId)
                .Include(t => t.Recipient)
                .ToListAsync();

            return Ok(transfers);
        }

        [HttpGet("received")]
        public async Task<ActionResult<IEnumerable<Transfer>>> GetReceivedTransfers()
        {
            var userId = User.FindFirstValue("uid");
            var receivedTransfers = await _context.Transfers
                .Where(t => t.RecipientId == userId)
                .Include(t => t.Sender)
                .ToListAsync();

            return Ok(receivedTransfers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transfer>> GetTransfer(int id)
        {
            var userId = User.FindFirstValue("uid");
            var transfer = await _context.Transfers
                .Include(t => t.Sender)
                .Include(t => t.Recipient)
                .FirstOrDefaultAsync(t =>
                    t.Id == id &&
                    (t.SenderId == userId || t.RecipientId == userId));

            if (transfer == null) return NotFound();
            return transfer;
        }

        [HttpPost]
        public async Task<ActionResult<Transfer>> CreateTransfer(Transfer transfer)
        {
            var senderId = User.FindFirstValue("uid");
            if (senderId == null || transfer.RecipientId == senderId)
                return BadRequest("Invalid sender or recipient.");

            transfer.SenderId = senderId;
            transfer.Date = DateTime.Now;

            _context.Transfers.Add(transfer);

            _context.Transactions.Add(new Transaction
            {
                Amount = -transfer.Amount,
                Category = "Transfer - Sent",
                Description = $"Transfer to user {transfer.RecipientId}",
                Date = DateTime.Now,
                UserId = senderId
            });

            _context.Transactions.Add(new Transaction
            {
                Amount = transfer.Amount,
                Category = "Transfer - Received",
                Description = $"Transfer from user {senderId}",
                Date = DateTime.Now,
                UserId = transfer.RecipientId
            });

 
            var sender = await _context.Users.FindAsync(senderId);
            var recipient = await _context.Users.FindAsync(transfer.RecipientId);

            if (sender == null || recipient == null)
                return BadRequest("Sender or recipient not found.");

            sender.Balance -= transfer.Amount;
            recipient.Balance += transfer.Amount;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransfer), new { id = transfer.Id }, transfer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransfer(int id, Transfer updated)
        {
            var userId = User.FindFirstValue("uid");
            if (id != updated.Id) return BadRequest();

            var existing = await _context.Transfers
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.SenderId == userId);

            if (existing == null) return Unauthorized("You can only update your own transfers.");

            updated.SenderId = userId;
            _context.Entry(updated).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransfer(int id)
        {
            var userId = User.FindFirstValue("uid");
            var transfer = await _context.Transfers
                .FirstOrDefaultAsync(t => t.Id == id && t.SenderId == userId);

            if (transfer == null) return Unauthorized("You can only delete your own transfers.");

            _context.Transfers.Remove(transfer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
