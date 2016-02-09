using System;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAngular2.Models
{
    public class FoodItem
    {
        [Key]
        public int Id { get; set; }
        public string ItemName { get; set; }
        public DateTime Created { get; set; }
    }
}
