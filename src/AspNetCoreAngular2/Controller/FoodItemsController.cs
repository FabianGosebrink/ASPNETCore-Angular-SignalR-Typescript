using System;
using System.Linq;
using ASPNETCoreAngular2Demo.Hubs;
using ASPNETCoreAngular2Demo.Models;
using ASPNETCoreAngular2Demo.Repositories;
using ASPNETCoreAngular2Demo.Services;
using ASPNETCoreAngular2Demo.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;

namespace ASPNETCoreAngular2Demo.Controller
{
    [Route("api/[controller]")]
    public class FoodItemsController : Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly IFoodRepository _foodRepository;
        private readonly IHubContext _coolMessageHubContext;

        public FoodItemsController(IFoodRepository foodRepository, IConnectionManager connectionManager, ITimerService timerService)
        {
            _foodRepository = foodRepository;
            _coolMessageHubContext = connectionManager.GetHubContext<CoolMessagesHub>();
            timerService.TimerElapsed += _timerService_TimerElapsed;
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
                return NotFound();
            }

            return Ok(Mapper.Map<FoodItemViewModel>(foodItem));
        }

        [HttpPost]
        public IActionResult AddFoodToList([FromBody] FoodItemViewModel viewModel)
        {

            if (viewModel == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            FoodItem singleById = _foodRepository.GetSingle(foodItemId);

            if (singleById == null)
            {
                return NotFound();
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
                return NotFound();
            }

            _foodRepository.Delete(foodItemId);
            _coolMessageHubContext.Clients.All.FoodDeleted();
            return new NoContentResult();
        }

        private void _timerService_TimerElapsed(object sender, EventArgs e)
        {
            TimerEventArgs eventsArgs = e as TimerEventArgs;
            _coolMessageHubContext.Clients.All.newCpuValue(eventsArgs.Value);
        }

    }
}
