using Application.Errors;
using Application.Interfaces;
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
    public class Unattend
    {
        public class Command : IRequest {
            public Guid ID { get; set; }
        }
        public class Handler : IRequestHandler<Command> {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccesor) {
                this._context = context;
                this._userAccessor = userAccesor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ID);
                if (activity == null) {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity." });
                }
                var user = await this._context.Users.SingleOrDefaultAsync(x => x.UserName == this._userAccessor.GetCurrentUsername());
                var attendance = await this._context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.ID && x.AppUserId == user.Id);
                if (attendance == null) { return Unit.Value; }
                if (attendance.IsHost) {
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "You cannot remove yourself as a host " });
                }
                this._context.Remove(attendance);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) { return Unit.Value; }
                throw new Exception("Problem saving changes");
            }
        }
    }
}
