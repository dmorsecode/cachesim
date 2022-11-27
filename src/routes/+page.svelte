<script>
	import Graph from '$lib/Graph.svelte';
	import gcc from '$lib/traces/gcc.trace?raw';
	import swim from '$lib/traces/swim.trace?raw';

	let files;
	let uploadedText = '';

	// wait for files
	$: if (files) {
		// read file as text
		const reader = new FileReader();
		reader.onload = () => {
			uploadedText = reader.result;
		};
		reader.readAsText(files[0]);
		loadFile(uploadedText);
	}

	let delay = 5;

	let counter = 0;

	$: hits = 0;
	$: misses = 0;

	$: prevHit = false;
	$: prevIndex = null;
	$: prevTag = null;

	let replacement = 'LRU';

	let cache = null;

	class Line {
		constructor(valid, tag, index, hex) {
			this.valid = valid;
			this.tag = tag;
			this.index = index;
			this.lastUsed = counter;
			this.hex = hex;
		}
	}

	let cachePower = 6;
	$: cacheSize = Math.pow(2, cachePower);

	let blockPower = 2;
	$: blockSize = Math.pow(2, blockPower);
	$: blockNum = cacheSize / blockSize;

	let assocPower = 0;
	$: assocNum = Math.pow(2, assocPower);

	$: setNum = cacheSize / (blockSize * assocNum);

	$: traceRemaining = 0;

	function handleChange() {
		if (assocPower > Math.log2(cacheSize / blockSize)) {
			assocPower = Math.log2(cacheSize / blockSize);
		}
	}

	function generateCache() {
		hits = 0;
		misses = 0;
		prevHit = false;
		counter = 0;
		cache = {};
		// fill cache with empty lines
		for (let i = 0; i < setNum; i++) {
			cache[i] = [];
			for (let j = 0; j < assocNum; j++) {
				// cache[i].push(new Line(false, 0, 0, '0x00000000'));
				cache[i].push(new Line(false, 0, 0, '0x00000000'));
			}
		}
		//console.log(cache);
	}

	function addAddress(addressNum) {
		// convert to binary
		let address = parseInt(addressNum, 16).toString(2);
		// pad with 0s
		while (address.length < 32) {
			address = '0' + address;
		}
		//console.log('address: ' + address.replace(/(.{4})/g, '$1 '));
		let tag = address.slice(0, address.length - cachePower - blockPower);
		let index = address.slice(
			address.length - cachePower - blockPower,
			address.length - blockPower
		);
		let block = address.slice(address.length - blockPower);
		//console.log('tag: ' + tag);
		//console.log('index: ' + index);
		//console.log('block: ' + block);
		// find which set this tag goes to based off associativity
		let set = parseInt(index, 2) % setNum;
		//console.log('set: ' + set);
		// check if tag and matching index is in cache already
		let hit = false;
		let empty = false;
		let emptyIndex = 0;
		for (let i = 0; i < assocNum; i++) {
			if (cache[set][i].valid && cache[set][i].tag === tag && cache[set][i].index === index) {
				hit = true;
				prevHit = true;
				if (replacement === 'LRU') {
					cache[set][i].lastUsed = counter;
				}
				break;
			} else if (!cache[set][i].valid) {
				empty = true;
				emptyIndex = i;
			}
		}
		// if not in cache, add it
		if (!hit) {
			misses++;
			prevHit = false;
			if (empty) {
				cache[set][emptyIndex] = new Line(true, tag, index, addressNum);
			} else {
				if (replacement === 'LRU' || replacement === 'FIFO') {
					let oldest = 0;
					for (let i = 0; i < assocNum; i++) {
						if (cache[set][i].lastUsed < cache[set][oldest].lastUsed) {
							oldest = i;
						}
					}
					cache[set][oldest] = new Line(true, tag, index, addressNum);
				} else if (replacement === 'Random') {
					let random = Math.floor(Math.random() * assocNum);
					cache[set][random] = new Line(true, tag, index, addressNum);
				}
			}
		} else {
			prevHit = true;
			hits++;
		}
		counter++;
		prevIndex = index;
		prevTag = tag;
	}

	function loadFile(file) {
		//console.log(uploadedText);

		let trace;
		switch (file) {
			case 'gcc':
				trace = gcc;
				generateCache();
				break;
			case 'swim':
				trace = swim;
				generateCache();
				break;
			// case 'read01':
			// 	trace = data.props.read01;
			// 	generateCache();
			// 	break;
			default:
				trace = file;
			//console.log(trace, uploadedText);
		}
		// console log every line of trace in 1 second intervals
		let lines = trace.split('\n');
		let i = 0;
		traceRemaining = lines.length - 1;
		if (delay > 1) {
			let interval = setInterval(() => {
				if (i < lines.length - 1) {
					// log every 5000 lines
					if (i % 1 === 0) {
						// take off first 2 and last 2 characters from line
						let address = lines[i].slice(2, -2);
						//console.log(address, i);
						addAddress(address);
						traceRemaining--;
					}
					i++;
				} else {
					clearInterval(interval);
				}
			}, delay);
		} else {
			lines.forEach((line) => {
				if (i >= lines.length - 1) return;
				let address = line.slice(2, -2);
				addAddress(address);
				//console.log(address, i);
				i++;
				traceRemaining--;
			});
		}
	}
</script>

<div class="m-3 flex flex-row">
	<div class=" w-1/3">
		<div id="leftSide">
			<div class="flex flex-row justify-between w-full flex-wrap">
				<button
					class="w-[49%] mb-1 btn btn-xs bg-primary focus:bg-primary-focus hover:bg-primary-focus"
					on:click={generateCache}>Generate Cache</button
				>

				<button
					disabled={cache == null}
					class="w-[49%] mb-1 btn btn-xs bg-gray-300 text-[#333333] focus:bg-gray-400 hover:bg-gray-400"
					on:click={() => loadFile('gcc')}>Run gcc.trace</button
				>
				<input
					disabled={cache == null}
					bind:files
					type="file"
					class="w-[49%] mb-1 file-input file-input-xs file-input-bordered bg-gray-300 text-[#333333]"
				/>
				<button
					disabled={cache == null}
					class="w-[49%] mb-1 btn btn-xs bg-gray-300 text-[#333333] focus:bg-gray-400 hover:bg-gray-400"
					on:click={() => loadFile('swim')}>Run swim.trace</button
				>

				<!-- <button
					disabled={cache == null}
					class="btn btn-xs bg-gray-300 text-[#333333] focus:bg-gray-400 hover:bg-gray-400"
					on:click={() => loadFile('read01')}>Load...</button
				> -->
			</div>
			<div class="w-full flex flex-col">
				<p>Cache Size: {cacheSize} bytes</p>
				<input
					type="range"
					on:input={handleChange}
					on:change={handleChange}
					min="6"
					max="14"
					bind:value={cachePower}
					class="range range-md mb-2"
					step="1"
				/>
				<p>Associativity: {assocNum}</p>
				<input
					type="range"
					min="0"
					max={Math.log2(cacheSize / blockSize)}
					bind:value={assocPower}
					class="range range-md mb-2"
					step="1"
					on:input={handleChange}
					on:change={handleChange}
				/>
				<p>Block Size: {blockSize} bytes</p>
				<input
					type="range"
					min="2"
					max="6"
					bind:value={blockPower}
					on:input={handleChange}
					on:change={handleChange}
					class="range range-md mb-2"
					step="1"
				/>
				<select bind:value={replacement} class="select select-sm select-bordered w-1/2">
					<option value="LRU">Least Recently Used (LRU)</option>
					<option value="FIFO">First In, First Out (FIFO)</option>
					<option value="Random">Random</option>
				</select>
				<div class="form-control pb-2">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<span class="label-text -mb-2">Line-by-line Delay</span>
					</label>
					<label class="input-group">
						<input
							bind:value={delay}
							on:input={() => {
								if (delay < 0) {
									delay = 0;
								}
								delay = delay;
							}}
							type="text"
							placeholder="5"
							class="input input-sm input-bordered w-2/5"
						/>
						<span>ms</span>
					</label>
				</div>
			</div>
			<div class="w-full">
				<table class="table table-compact table-zebra w-full text-center">
					<tbody>
						<tr>
							<td>Lines: {blockNum}</td>
							<td>Sets: {setNum}</td>
						</tr>
						<tr>
							<td>Lines / Set: {assocNum}</td>
							<td
								>{#if setNum == 1}
									FULLY ASSOCIATIVE
								{:else if setNum == blockNum}
									DIRECT MAPPED
								{:else}
									{assocNum}-WAY SET ASSOCIATIVE
								{/if}</td
							>
						</tr>
						<tr>
							<td>Total Hits: {hits}</td>
							<td
								>Hit Rate: {hits || misses
									? Math.round((hits / (hits + misses)) * 10000) / 100 + '%'
									: 'N/A'}</td
							>
						</tr>
						<tr>
							<td>Total Misses: {misses}</td>
							<td>Accesses Remaining: {traceRemaining}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Graph />
	</div>

	<!-- <div class="form-control w-1/3">
		<div class="input-group">
			<input
				class="input input-sm bg-slate-100 text-black"
				type="text"
				id="addressInput"
				placeholder="Address"
			/>
			<button
				class="btn btn-sm bg-info-base-content text-white"
				on:click={() => {
					let address = document.getElementById('addressInput').value;
					if (address) {
						addAddress(address);
					}
				}}>Add Address</button
			>
		</div>
	</div> -->
	<div class="flex-grow overflow-scroll h-[46rem] bg-[#eeeeee] ml-2 rounded">
		<table class="table table-compact table-zebra">
			{#if cache}
				{#each Object.keys(cache) as set}
					<tr class="w-full">
						<td class="bg-gray-300">SET {set}</td>
						{#each cache[set] as block}
							<td
								class="text-center text-justify transition-all duration-[10ms] ease-in-out font-mono"
								class:text-xs={block.hex == '0x00000000' && false}
								class:opacity-30={block.hex == '0x00000000' && block.lastUsed < 1}
								class:bg-[#4BB543]={prevIndex == block.index &&
									prevTag == block.tag &&
									prevHit &&
									block.lastUsed > 1}
								class:bg-[#CC0000]={prevIndex == block.index &&
									prevTag == block.tag &&
									!prevHit &&
									block.lastUsed > 0}>{block.hex}</td
							>
						{/each}
					</tr>
				{/each}
			{/if}
		</table>
	</div>
</div>
