using System.Collections.Generic;
using Angular2Demo.Models;

namespace Angular2Demo.Repositories
{
    public interface IFoodRepository
    {
        List<FoodItem> GetAll();
        FoodItem GetSingle(int id);
        FoodItem Add(FoodItem toAdd);
        FoodItem Update(FoodItem toUpdate);
        void Delete(int id);
    }
}
