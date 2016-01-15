namespace AspNet5Angular2Demo.Repositories
{
    using System.Collections.Generic;

    using AspNet5Angular2Demo.Models;

    public interface IFoodRepository
    {
        List<FoodItem> GetAll();
        FoodItem GetSingle(int id);
        FoodItem Add(FoodItem toAdd);
        FoodItem Update(FoodItem toUpdate);
        void Delete(int id);
    }
}
