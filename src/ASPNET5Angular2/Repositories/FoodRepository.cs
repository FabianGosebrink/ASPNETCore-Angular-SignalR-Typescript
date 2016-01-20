using System;
using System.Collections.Generic;
using System.Linq;
using ASPNET5Angular2.Models;

namespace ASPNET5Angular2.Repositories
{
    public class FoodRepository : IFoodRepository
    {
        readonly Dictionary<int, FoodItem> _foods = new Dictionary<int, FoodItem>();

        public FoodRepository()
        {
            _foods.Add(1, new FoodItem() { ItemName = "Spaghetti Bolognese", Id = 1, Created = DateTime.Now});
        }

        public List<FoodItem> GetAll()
        {
            return _foods.Select(x => x.Value).ToList();
        }

        public FoodItem GetSingle(int id)
        {
            return _foods.FirstOrDefault(x => x.Key == id).Value;
        }

        public FoodItem Add(FoodItem toAdd)
        {
            int newId = !GetAll().Any() ? 1 : GetAll().Max(x => x.Id) + 1;
            toAdd.Id = newId;
            _foods.Add(newId, toAdd);
            return toAdd;
        }

        public FoodItem Update(FoodItem toUpdate)
        {
            FoodItem single = GetSingle(toUpdate.Id);

            if (single == null)
            {
                return null;
            }

            _foods[single.Id] = toUpdate;
            return toUpdate;
        }

        public void Delete(int id)
        {
            _foods.Remove(id);
        }
    }
}