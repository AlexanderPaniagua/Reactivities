using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto> {
            public Guid ID { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this._context = context;
                this._mapper = mapper;
            }

            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw new Exception("Computer says no!");
                //throw new NotImplementedException();
                //cancellationToken not implemented due to FindAsync complexity
                var activity = await this
                    ._context
                    .Activities
                    //.FindAsync(request.ID)
                    //eager loading
                    //.Include(x => x.UserActivities)
                    //.ThenInclude(x => x.AppUser)
                    //.SingleOrDefaultAsync(x => x.ID == request.ID)
                    //lazy loading
                    .FindAsync(request.ID)
                    ;
                if (activity == null)
                {
                    //throw new Exception("Could not find activity");
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });
                }
                //return activity;
                var activityToReturn = this._mapper.Map<Activity, ActivityDto>(activity);
                return activityToReturn;
            }
        }
    }
}
