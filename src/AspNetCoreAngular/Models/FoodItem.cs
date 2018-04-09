using System;
using System.ComponentModel.DataAnnotations;

namespace ASPNETCoreAngular2Demo.Models
{
    public class FoodItem
    {
        [Key]
        public int Id { get; set; }
        public string ItemName { get; set; }
        public DateTime Created { get; set; }
    }
}
