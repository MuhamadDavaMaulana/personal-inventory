<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::where('user_id', $request->user()->user_id)
                     ->with('category');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,category_id',
            'name'        => 'required|string|max:150',
            'description' => 'nullable|string',
            'quantity'    => 'integer|min:1',
            'condition'   => 'required|in:good,damaged,lost',
            'status'      => 'in:available,borrowed',
            'image'       => 'nullable|string',
        ]);

        $item = Item::create([
            'user_id'     => $request->user()->user_id,
            ...$request->only([
                'category_id', 'name', 'description',
                'quantity', 'condition', 'status', 'image'
            ]),
        ]);

        return response()->json($item->load('category'), 201);
    }

    public function show(Request $request, $id)
    {
        $item = Item::where('item_id', $id)
                    ->where('user_id', $request->user()->user_id)
                    ->with(['category', 'loans'])
                    ->firstOrFail();

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::where('item_id', $id)
                    ->where('user_id', $request->user()->user_id)
                    ->firstOrFail();

        $request->validate([
            'category_id' => 'sometimes|exists:categories,category_id',
            'name'        => 'sometimes|string|max:150',
            'condition'   => 'sometimes|in:good,damaged,lost',
            'status'      => 'sometimes|in:available,borrowed',
            'quantity'    => 'sometimes|integer|min:1',
        ]);

        $item->update($request->only([
            'category_id', 'name', 'description',
            'quantity', 'condition', 'status', 'image'
        ]));

        return response()->json($item);
    }

    public function destroy(Request $request, $id)
    {
        $item = Item::where('item_id', $id)
                    ->where('user_id', $request->user()->user_id)
                    ->firstOrFail();

        $item->delete();

        return response()->json(['message' => 'Barang dihapus']);
    }
}