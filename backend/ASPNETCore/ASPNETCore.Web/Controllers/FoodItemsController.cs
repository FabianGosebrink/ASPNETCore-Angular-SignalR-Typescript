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
        private readonly IHubContext<ChatHub> _chatHubContext;
        private readonly IMapper _mapper;

        public FoodItemsController(
            IFoodRepository foodRepository,
            IHubContext<ChatHub> hubContext,
             IMapper mapper)
        {
            _foodRepository = foodRepository;
            _chatHubContext = hubContext;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<List<FoodItemDto>> GetAllFoods()
        {
            var foods = _foodRepository.GetAll();
            return Ok(foods.Select(x => _mapper.Map<FoodItemDto>(x)));
        }

        [HttpGet]
        [Route("{id:int}", Name = nameof(GetSingleFood))]
        public ActionResult<FoodItemDto> GetSingleFood(int id)
        {
            FoodItem foodItem = _foodRepository.GetSingle(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<FoodItemDto>(foodItem));
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

            FoodItem item = _mapper.Map<FoodItem>(viewModel);
            item.Created = DateTime.Now;
            FoodItem newFoodItem = _foodRepository.Add(item);

            _chatHubContext.Clients.All.SendAsync("FoodAdded", newFoodItem);

            return CreatedAtRoute(
                nameof(GetSingleFood),
                new { id = newFoodItem.Id },
                _mapper.Map<FoodItemDto>(newFoodItem));
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
            _chatHubContext.Clients.All.SendAsync("FoodUpdated", newFoodItem);
            return Ok(_mapper.Map<FoodItemDto>(newFoodItem));
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

            _chatHubContext.Clients.All.SendAsync("FoodDeleted");
            return NoContent();
        }
    }
}
