using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Angular2Demo.Repositories;
using Ninject;

namespace Angular2Demo.App_Start
{
    public static class NinjectConfig
    {
        public static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Bind<IFoodRepository>().ToConstant(new FoodRepository());

            return kernel;
        }
    }
}
