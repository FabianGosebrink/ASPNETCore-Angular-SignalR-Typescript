using System.Collections.Generic;
using ASPNETCoreAngular2Demo.Models;

namespace ASPNETCoreAngular2Demo.Repositories
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
