using System;
using System.Collections.Generic;
using System.Linq;
using AspNetCoreAngularSignalR.Dtos;
using AspNetCoreAngularSignalR.Hubs;
using AspNetCoreAngularSignalR.Models;
using AspNetCoreAngularSignalR.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace AspNetCoreAngularSignalR.Controllers
{
  [Route("api/[controller]")]
    public class FoodItemsController : Controller
    {
        private readonly IFoodRepository _foodRepository;
        private readonly IHubContext<CoolMessagesHub> _coolMessageHubContext;

        public FoodItemsController(IFoodRepository foodRepository, IHubContext<CoolMessagesHub> hubContext)
        {
            _foodRepository = foodRepository;
            _coolMessageHubContext = hubContext;
        }

        [HttpGet]
        public ActionResult<List<FoodItemDto>> GetAllFoods()
        {
            var foods = _foodRepository.GetAll();
            return Ok(foods.Select(x => Mapper.Map<FoodItemDto>(x)));
        }

        [HttpGet]
        [Route("{foodItemId:int}", Name = "GetSingleFood")]
        public ActionResult<FoodItemDto> GetSingleFood(int foodItemId)
        {
            FoodItem foodItem = _foodRepository.GetSingle(foodItemId);

            if (foodItem == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<FoodItemDto>(foodItem));
        }

        [HttpPost]
        public ActionResult AddFoodToList([FromBody] FoodItemDto viewModel)
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

            _coolMessageHubContext.Clients.All.SendAsync("FoodAdded",newFoodItem);

            return CreatedAtRoute(
                "GetSingleFood",
                new { foodItemId = newFoodItem.Id },
                Mapper.Map<FoodItemDto>(newFoodItem));
        }

        [HttpPut]
        [Route("{foodItemId:int}")]
        public ActionResult<FoodItemDto> UpdateFoodInList(int foodItemId, [FromBody] FoodItemDto viewModel)
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
            _coolMessageHubContext.Clients.All.SendAsync("FoodUpdated", newFoodItem);
            return Ok(Mapper.Map<FoodItemDto>(newFoodItem));
        }

        [HttpDelete]
        [Route("{foodItemId:int}")]
        public ActionResult DeleteFoodFromList(int foodItemId)
        {

            FoodItem singleById = _foodRepository.GetSingle(foodItemId);

            if (singleById == null)
            {
                return NotFound();
            }

            _foodRepository.Delete(foodItemId);

            _coolMessageHubContext.Clients.All.SendAsync("FoodDeleted");
            return NoContent();
        }
    }
}
