/*
 * Copyright (c) 2021 Louis Langholtz https://github.com/louis-langholtz/PlayRho
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

#include "PlayRho/Dynamics/WorldImplShape.hpp"

#include "PlayRho/Dynamics/WorldImpl.hpp"

#include "PlayRho/Collision/Shapes/Shape.hpp"

namespace playrho {
namespace d2 {

ShapeCounter GetShapeRange(const WorldImpl& world) noexcept
{
    return world.GetShapeRange();
}

ShapeID CreateShape(WorldImpl& world, const Shape& def)
{
    return world.CreateShape(def);
}

const Shape& GetShape(const WorldImpl& world, ShapeID id)
{
    return world.GetShape(id);
}

void SetShape(WorldImpl& world, ShapeID id, const Shape& def)
{
    world.SetShape(id, def);
}

void Destroy(WorldImpl& world, ShapeID id)
{
    world.Destroy(id);
}

} // namespace d2
} // namespace playrho