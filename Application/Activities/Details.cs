using Application.Errors;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity> {
            public Guid ID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw new Exception("Computer says no!");
                //throw new NotImplementedException();
                //cancellationToken not implemented due to FindAsync complexity
                var activity = await this._context.Activities.FindAsync(request.ID);
                if (activity == null)
                {
                    //throw new Exception("Could not find activity");
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });
                }
                return activity;
            }
        }
    }
}
