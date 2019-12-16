using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid ID { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities.FindAsync(request.ID);
                if (activity == null) { throw new Exception("Could not find activity"); }
                this._context.Remove(activity);
                var success = await this._context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;//Unit.Value is an empty object, returning it means we're returning the control back to the api controller with a 200 http code
                throw new Exception("Problem saving changes");
            }
        }
    }
}
