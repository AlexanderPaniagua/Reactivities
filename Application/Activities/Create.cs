using Domain;
using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class Create
    {
        //Downside of using mediatr pattern vs repository pattern: write more code than repository
        //We're not returning an activity entity from this command
        public class Command : IRequest {
            public Guid ID { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator() {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();

            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor) {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //throw new NotImplementedException();
                //Manual mapping
                var activity = new Activity {
                    ID = request.ID,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City,
                    Venue = request.Venue
                };

                //When not using special value generators there's no need to use async methods.
                this._context.Activities.Add(activity);

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendee = new UserActivity {
                    AppUser = user,
                    Activity = activity,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserActivities.Add(attendee);

                var success = await this._context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;//Unit.Value is an empty object, returning it means we're returning the control back to the api controller with a 200 http code
                throw new Exception("Problem saving changes");
            }
        }
    }
}
