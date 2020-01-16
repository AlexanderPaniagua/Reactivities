using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using MediatR;
using Domain;
using Application.Activities;
using System.Threading;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class ActivitiesController : BaseController
    {
        //private readonly IMediator _mediator;
        //public ActivitiesController(IMediator mediator) { this._mediator = mediator; }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Activity>> Details(Guid id) {
            return await this.Mediator.Send(new Details.Query { ID = id });
        }

        [HttpPost]
        //If not using the [ApiController] attribute from top, we'll need to specify [fromBody] to give a hint to the controller where to look for the properties that we are sending
        public async Task<ActionResult<Unit>> Create(Create.Command command) {
            return await this.Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command) {
            command.ID = id;
            return await this.Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id) {
            return await this.Mediator.Send(new Delete.Command { ID = id });
        }
    }
}
