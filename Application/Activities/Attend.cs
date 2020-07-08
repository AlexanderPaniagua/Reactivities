using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Attend
    {

        public class Command : IRequest {
            public Guid ID { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken) {
                var activity = await this._context.Activities.FindAsync(request.ID);
                if (activity == null) {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity." });
                }
                var user = await this._context.Users.SingleOrDefaultAsync(x => x.UserName == this._userAccessor.GetCurrentUsername());
                var attendance = await this._context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.ID && x.AppUserId == user.Id);
                if (attendance != null) {
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Already attending this activity." });
                }
                attendance = new UserActivity { Activity = activity, AppUser = user, IsHost = false, DateJoined = DateTime.Now };
                this._context.UserActivities.Add(attendance);
                var success = await this._context.SaveChangesAsync() > 0;
                if (success) { return Unit.Value; }
                throw new Exception("Problem saving changes");
            }
        }
    }
}
