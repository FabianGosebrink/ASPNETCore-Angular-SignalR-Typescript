using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;
using Angular2Demo.App_Start;
using Angular2Demo.Models;
using Angular2Demo.ViewModels;
using AutoMapper;
using Microsoft.Owin;
using Owin;
using WebApiContrib.IoC.Ninject;

[assembly: OwinStartup(typeof(Angular2Demo.Startup))]

namespace Angular2Demo
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration
            {
                DependencyResolver = new NinjectResolver(NinjectConfig.CreateKernel())
            };

            WebApiConfig.Register(config);

            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());

            Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<FoodItem, FoodItemViewModel>().ReverseMap();
            });

            app.UseWebApi(config);
        }
    }
}
