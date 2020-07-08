using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class UserActivity
    {
        public string AppUserId { get; set; }
        //eager loading
        //public AppUser AppUser { get; set; }
        //lazy loading
        public virtual AppUser AppUser { get; set; }
        public Guid ActivityId { get; set; }
        //eager loading
        //public Activity Activity { get; set; }
        //lazy loading
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}
