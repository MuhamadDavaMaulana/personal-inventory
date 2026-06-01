<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where('user_id', $request->user()->user_id)->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'user_id'     => $request->user()->user_id,
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }

    public function show(Request $request, $id)
    {
        $category = Category::where('category_id', $id)
                            ->where('user_id', $request->user()->user_id)
                            ->firstOrFail();

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::where('category_id', $id)
                            ->where('user_id', $request->user()->user_id)
                            ->firstOrFail();

        $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
        ]);

        $category->update($request->only(['name', 'description']));

        return response()->json($category);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::where('category_id', $id)
                            ->where('user_id', $request->user()->user_id)
                            ->firstOrFail();

        $category->delete();

        return response()->json(['message' => 'Kategori dihapus']);
    }
}