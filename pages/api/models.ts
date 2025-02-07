import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { deleteCookie, getCookie, setCookie, hasCookie, getCookies } from 'cookies-next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  var { searchQuery = "", tagsFilter = "all", categoryFilter = "all", currentPage = 1, modelId = -1, formRequest = 'false' } = req.query
  var isQuery = false;

  if( formRequest == 'false'){
    let param = await getCookie('query', { res, req });
    if(param != undefined){
      let param_obj = JSON.parse(param);
      ({ searchQuery, tagsFilter, categoryFilter, currentPage } = param_obj);
      req.query = param_obj;
      isQuery = true;
    }
  }else{
    await setCookie('query', req.query, { res, req });
  }

  let query = supabase
    .from('model_cards')
    .select('*', { count: 'exact' });

  if (categoryFilter !== "all") {
    query = query.ilike('category', `%${categoryFilter}%`);
  }

  if (searchQuery != "") {
    query = query.ilike('desc', `%${searchQuery}%`);
  }

  if (tagsFilter != "all") {
    query = query.contains('tags', [tagsFilter]);
  }

  if (modelId != -1) {
    query = query.eq('id', modelId);
  }

  const { data, error, count } = await query.range((Number(currentPage) - 1) * 30, Number(currentPage) * 30 - 1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if(isQuery){
    res.status(200).json({ data, totalPages: Math.ceil((count ?? 0) / 30), query: req.query});
  }else{
    res.status(200).json({ data, totalPages: Math.ceil((count ?? 0) / 30)});
  }
}
