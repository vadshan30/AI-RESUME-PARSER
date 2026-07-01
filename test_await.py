import asyncio

async def test():
    gap_task = None
    # Will this raise an error?
    res = await gap_task if gap_task else {}
    print("Success:", res)

asyncio.run(test())
