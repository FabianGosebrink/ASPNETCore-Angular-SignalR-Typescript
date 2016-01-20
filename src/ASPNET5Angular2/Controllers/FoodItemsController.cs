using System;
using System.Linq;
using ASPNET5Angular2.Hubs;
using ASPNET5Angular2.Models;
using ASPNET5Angular2.Repositories;
using ASPNET5Angular2.ViewModels;
using AutoMapper;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace ASPNET5Angular2.Controllers
{
    [Route("api/[controller]")]
    public class FoodItemsController : Controller
    {
        private readonly IFoodRepository _foodRepository;
        private readonly IHubContext _coolMessageHubContext;

        public FoodItemsController(IFoodRepository foodRepository, IConnectionManager connectionManager)
        {
            _foodRepository = foodRepository;
            _coolMessageHubContext = connectionManager.GetHubContext<CoolMessagesHub>();
        }

        [HttpGet]
        public IActionResult GetAllFoods()
        {
            var foods = _foodRepository.GetAll();
            return Ok(foods.Select(x => Mapper.Map<FoodItemViewModel>(x)));
        }

        [HttpGet]
        [Route("{foodItemId:int}", Name = "GetSingleFood")]
        public IActionResult GetSingleFood(int foodItemId)
        {
            FoodItem foodItem = _foodRepository.GetSingle(foodItemId);

            if (foodItem == null)
            {
                return HttpNotFound();
            }

            return Ok(Mapper.Map<FoodItemViewModel>(foodItem));
        }

        [HttpPost]
        public IActionResult AddFoodToList([FromBody] FoodItemViewModel viewModel)
        {

            if (viewModel == null)
            {
                return HttpBadRequest();
            }

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }


            FoodItem item = Mapper.Map<FoodItem>(viewModel);
            item.Created = DateTime.Now;
            FoodItem newFoodItem = _foodRepository.Add(item);

            _coolMessageHubContext.Clients.All.FoodAdded(newFoodItem);

            return CreatedAtRoute(
                "GetSingleFood",
                new { foodItemId = newFoodItem.Id },
                Mapper.Map<FoodItemViewModel>(newFoodItem));

        }

        [HttpPut]
        [Route("{foodItemId:int}")]
        public IActionResult UpdateFoodInList(int foodItemId, [FromBody] FoodItemViewModel viewModel)
        {
            if (viewModel == null)
            {
                return HttpBadRequest();
            }

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }


            FoodItem singleById = _foodRepository.GetSingle(foodItemId);

            if (singleById == null)
            {
                return HttpNotFound();
            }

            singleById.ItemName = viewModel.ItemName;

            FoodItem newFoodItem = _foodRepository.Update(singleById);
            _coolMessageHubContext.Clients.All.FoodUpdated(newFoodItem);
            return Ok(Mapper.Map<FoodItemViewModel>(newFoodItem));
        }

        [HttpDelete]
        [Route("{foodItemId:int}")]
        public IActionResult DeleteFoodFromList(int foodItemId)
        {

            FoodItem singleById = _foodRepository.GetSingle(foodItemId);

            if (singleById == null)
            {
                return HttpNotFound();
            }

            _foodRepository.Delete(foodItemId);

            return new NoContentResult();
        }
    }
}
