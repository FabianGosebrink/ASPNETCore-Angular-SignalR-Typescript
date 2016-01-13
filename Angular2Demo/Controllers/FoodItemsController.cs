using System;
using System.Linq;
using System.Net;
using System.Web.Http;
using Angular2Demo.Models;
using Angular2Demo.Repositories;
using Angular2Demo.ViewModels;
using AutoMapper;

namespace Angular2Demo.Controllers
{
    [RoutePrefix("api")]
    public class FoodItemsController : ApiController
    {
        private readonly IFoodRepository _foodRepository;

        public FoodItemsController(IFoodRepository foodRepository)
        {
            _foodRepository = foodRepository;
        }

        [HttpGet]
        public IHttpActionResult GetAllFoods()
        {
            try
            {
                var foods = _foodRepository.GetAll();
                return Ok(foods.Select(x => Mapper.Map<FoodItemViewModel>(x)));
            }
            catch (Exception exception)
            {
                return InternalServerError(exception); 
            }
        }

        [HttpGet]
        [Route("{foodItemId:int}", Name = "GetSingleFood")]
        public IHttpActionResult GetSingleFood(int foodItemId)
        {
            try
            {
                FoodItem foodItem = _foodRepository.GetSingle(foodItemId);

                if (foodItem == null)
                {
                    return NotFound();
                }

                return Ok(Mapper.Map<FoodItemViewModel>(foodItem));
            }
            catch (Exception exception)
            {
                return InternalServerError(exception);
            }
        }

        [HttpPost]
        public IHttpActionResult AddFoodToList([FromBody]FoodItemViewModel viewModel)
        {
            try
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

                return CreatedAtRoute("GetSingleFood", new { foodItemId = newFoodItem.Id }, Mapper.Map<FoodItemViewModel>(newFoodItem));
            }
            catch (Exception exception)
            {
                return InternalServerError(exception);
            }
        }

        [HttpPut]
        [Route("{foodItemId:int}")]
        public IHttpActionResult UpdateFoodInList(int foodItemId, [FromBody]FoodItemViewModel viewModel)
        {
            try
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

                return Ok(Mapper.Map<FoodItemViewModel>(newFoodItem));
            }
            catch (Exception exception)
            {
                return InternalServerError(exception);
            }
        }

        [HttpDelete]
        [Route("{foodItemId:int}")]
        public IHttpActionResult DeleteFoodFromList(int foodItemId)
        {
            try
            {
                FoodItem singleById = _foodRepository.GetSingle(foodItemId);

                if (singleById == null)
                {
                    return NotFound();
                }

                _foodRepository.Delete(foodItemId);

                return StatusCode(HttpStatusCode.NoContent);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception);
            }
        }
    }
}
