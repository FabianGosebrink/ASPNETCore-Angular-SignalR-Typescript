namespace AspNet5Angular2Demo.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class FoodItem
    {
        [Key]
        public int Id { get; set; }
        public string ItemName { get; set; }
        public DateTime Created { get; set; }
    }
}
