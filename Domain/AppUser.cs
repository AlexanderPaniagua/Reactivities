using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class AppUser: IdentityUser
    {
        public string DisplayName { get; set; }
        //eager loading
        //public ICollection<UserActivity> UserActivities { get; set; }
        //lazy loading
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}
