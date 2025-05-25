using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace FinancialManagementWepApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RealExchangeRateController : ControllerBase
    {
        [HttpGet("{currencyCode}")]
        public IActionResult GetExchangeRate(string currencyCode)
        {
            try
            {
                string url = "https://www.tcmb.gov.tr/kurlar/today.xml";
                XDocument xml = XDocument.Load(url);

                var rate = xml.Descendants("Currency")
                    .Where(x => x.Attribute("CurrencyCode")?.Value == currencyCode.ToUpper())
                    .Select(x => new
                    {
                        Currency = currencyCode.ToUpper(),
                        ForexBuying = x.Element("ForexBuying")?.Value,
                        ForexSelling = x.Element("ForexSelling")?.Value,
                        BanknoteBuying = x.Element("BanknoteBuying")?.Value,
                        BanknoteSelling = x.Element("BanknoteSelling")?.Value
                    })
                    .FirstOrDefault();

                if (rate == null)
                    return NotFound(new { message = "Currency not found." });

                return Ok(rate);
            }
            catch
            {
                return StatusCode(500, new { message = "Failed to fetch data from TCMB." });
            }
        }
    }
}
