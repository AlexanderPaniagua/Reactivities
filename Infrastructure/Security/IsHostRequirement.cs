﻿using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
        public Guid ID { get; set; }
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context) {
            this._context = context;
            this._httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            //var currentUserName = this._httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value.ToString();
            var currentUserName = this._httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var activityId = Guid.Parse(this._httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());
            var activity = this._context.Activities.FindAsync(activityId).Result;
            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);
            if (host?.AppUser?.UserName == currentUserName)
            {
                context.Succeed(requirement);
            }
            else {
                context.Fail();
            }
            return Task.CompletedTask;
            /*if (context.Resource is AuthorizationFilterContext authContext)
            {
                var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                var activityId = Guid.Parse(authContext.RouteData.Values["id"].ToString());

                var activity = _context.Activities.FindAsync(activityId).Result;

                var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

                if (host?.AppUser?.UserName == currentUserName) { context.Succeed(requirement); }

            }
            else {
                Console.WriteLine("failed");
                context.Fail();
            }
            return Task.CompletedTask;*/
        }
    }

}
