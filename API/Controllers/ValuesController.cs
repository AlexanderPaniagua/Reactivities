using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {

        private readonly DataContext _context;

        public ValuesController(DataContext context) {
            this._context = context;
        }

        // GET api/values
        [HttpGet]
        //public ActionResult<IEnumerable<string>> Get()//v1
        //public ActionResult<IEnumerable<Value>> Get()//v2
        public async Task<ActionResult<IEnumerable<Value>>> Get()
        {
            //return new string[] { "value1", "value2" };//v1
            //var values = this._context.Values.ToList();//v2
            var values = await this._context.Values.ToListAsync();
            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        //public ActionResult<string> Get(int id)//v1
        public async Task<ActionResult<string>> Get(int id)
        {
            //return "value";//v1
            var value = await this._context.Values.FindAsync(id);//Find or single async
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
