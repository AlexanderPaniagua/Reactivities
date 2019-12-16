using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        //With mediatr we need both query and handler
        
        //Returning List of Activities, no properties declared since we're just goin to retrieve a list of activities from our db and we don't need to provide parameters
        public class Query : IRequest<List<Activity>> { }
        
        //Application logic in Handler class. At this point the API will not know anything about the datacontext, db, logic it will just receive http request and send http responses
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            //Inject DataContext in Handler
            public Handler(DataContext context, ILogger<List> logger) { this._context = context; this._logger = logger; }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw new NotImplementedException();
                try
                {
                    for (var i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);
                        this._logger.LogInformation($"Task {i} has completed.");
                    }
                }
                catch (Exception ex) when (ex is TaskCanceledException) {
                    this._logger.LogInformation($"Task was cancelled.");
                }
                var activities = await this._context.Activities.ToListAsync(cancellationToken);
                return activities;
            }
        }
    }
}
